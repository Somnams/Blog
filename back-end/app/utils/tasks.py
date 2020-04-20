import json
import sys
import time
from rq import get_current_job
from app import create_app
from app.extensions import db
from app.models import User, Post, Message, Task
from app.utils.email import send_email
from config import Config


# RQ worker 在我们的博客Flask应用之外运行，所以需要创建自己的应用实例
app = create_app(Config)
# 后续会使用Flask-SQLAlchemy来查询数据库，所以需要推送一个上下文使应用成为 "当前" 的应用实例
app.app_context().push()


def test_rq(num):
    print('Starting task')
    for i in range(num):
        print(i)
        time.sleep(1)
    print('Task completed')
    return 'Done'


def _set_task_progress(progress):
    job = get_current_job()  # 当前后台任务
    if job:
        job.meta['progress'] = progress
        job.save_meta()
        task = Task.query.get(job.get_id())  # 通过任务ID查出对应的Task对象
        # 动态地给Task所属用户，发送她的后台任务的进度百分比
        task.user.add_notification('task_progress', {'task_id': job.get_id(),
                                                     'description': task.description,
                                                     'progress': progress})
        if progress >= 100:  # 进度为100%时，更新Task对象为已完成
            task.complete = True
        db.session.commit()


def send_messages(*args, **kwargs):
    """群发私信"""
    try:  # 由于 rq worker 运行在单独的进程中，当它出现意外错误时，我们需要捕获异常
        _set_task_progress(0)
        i = 0

        # 发送方
        sender = User.query.get(kwargs.get('user_id'))
        # 接收方
        recipients = User.query.filter(User.id != kwargs.get('user_id'))
        total_recipients = recipients.count()

        for user in recipients:
            message = Message()
            message.body = kwargs.get('body')
            message.sender = sender
            message.recipient = user
            db.session.add(message)
            # 给私信接收者发送新私信通知
            user.add_notification('unread_messages_count', user.new_recived_messages())
            db.session.commit()

            # 给接收者同时发送一封邮件(因为私信必须用户登录网站才看得到，邮件也需要)
            text_body = '''
            Dear {},
            {}
            Sincerely,
            The Madblog Team
            Note: replies to this email address are not monitored.
            '''.format(user.username, message.body)

            html_body = '''
            <p>Dear {0},</p>
            <p>{1}</p>
            <p>Sincerely,</p>
            <p>The Madblog Team</p>
            <p><small>Note: replies to this email address are not monitored.</small></p>
            '''.format(user.username, message.body)
            '''
            # 后台任务已经是异步了，所以send_email()没必要再用多线程异步，所以这里指定了 sync=True
            send_email('[Madblog] 温馨提醒',
                       sender=app.config['MAIL_SENDER'],
                       recipients=[user.email],
                       text_body=text_body,
                       html_body=html_body,
                       sync=True)
            '''
            # 模拟长时间的后台任务
            time.sleep(3)

            i += 1
            _set_task_progress(100 * i // total_recipients)

        # 群发结束后，由管理员再给发送方发送一条已完成的提示私信
        admin = User.query.filter_by(email=app.config['ADMINS'][0]).first()
        if sender != admin:  # 不能自己给自己发送私信
            message = Message()
            message.body = '[群发私信]已完成, 内容: \n\n' + kwargs.get('body')
            message.sender = admin
            message.recipient = sender
            db.session.add(message)
            # 给发送方发送新私信通知
            sender.add_notification('unread_messages_count', sender.new_recived_messages())
            db.session.commit()

    except Exception:
        app.logger.error('[群发私信]后台任务出错了', exc_info=sys.exc_info())


def export_posts(*args, **kwargs):
    """导出用户的所有文章"""
    try:
        _set_task_progress(0)
        i = 0
        data = []

        user = User.query.get(kwargs.get('user_id'))
        total_posts = user.posts.count()
        for post in user.posts.order_by(Post.timestamp.asc()):
            data.append({'body': post.body,
                         'timestamp': post.timestamp.isoformat() + 'Z'})
            time.sleep(3)
            i += 1
            _set_task_progress(100 * i // total_posts)

        text_body = '''
        Dear {},
        Please find attached the archive of your posts that you requested.
        Sincerely,
        The Madblog Team
        Note: replies to this email address are not monitored.
        '''.format(user.username)

        html_body = '''
        <p>Dear {0},</p>
        <p>Please find attached the archive of your posts that you requested.</p>
        <p>Sincerely,</p>
        <p>The Madblog Team</p>
        <p><small>Note: replies to this email address are not monitored.</small></p>
        '''.format(user.username)
        '''
        send_email('[Madblog] 导出文章',
                   sender=app.config['MAIL_SENDER'],
                   recipients=[user.email],
                   text_body=text_body,
                   html_body=html_body,
                   attachments=[('posts.json', 'application/json',
                                 json.dumps({'posts': data}, indent=4))],
                   sync=True)
        '''
    except Exception:
        _set_task_progress(100)
        app.logger.error('[导出文章]后台任务出错了', exc_info=sys.exc_info())