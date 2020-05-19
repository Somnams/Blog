import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY', 'you-will-never-guess')
    SQLALCHEMY_DATABASE_URI = \
        os.environ.get('DATABASE_URL', 'sqlite:////' + os.path.join(basedir, 'app.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # 日志输出到控制台还是日志文件中
    # LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT', 'false').lower() in ['true', 'on', '1']
    # 管理员的邮箱地址列表
    ADMINS = [x.strip()[1:-1] for x in os.environ.get('ADMINS')[1:-1].split(',')]
    # 同源策略
    ORIGINS = [x.strip()[1:-1] for x in os.environ.get('ORIGINS')[1:-1].split(',')]
    # 博客地址
    BLOG_HOST = os.environ.get('BLOG_HOST', 'http://127.0.0.1:5000')
    # 邮件配置
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'false').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_SENDER = os.environ.get('MAIL_SENDER')
    # 分页设置
    POSTS_PER_PAGE = 10
    USERS_PER_PAGE = 10
    COMMENTS_PER_PAGE = 10
    MESSAGES_PER_PAGE = 10
    TASKS_PER_PAGE = 10
    # Redis 用于 RQ 任务队列
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://')
    # ELASTICSEARCH 服务
    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')
    # 语言
    LANGUAGES = ['zh', 'en']
