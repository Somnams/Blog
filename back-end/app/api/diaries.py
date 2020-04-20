from flask import request, jsonify, url_for, g, current_app
from app.api import bp
from app.api.auth import token_auth
from app.api.errors import error_response, bad_request
from app.extensions import db
from app.models import Diary


@bp.route('/diaries/', methods=['POST'])
@token_auth.login_required
def create_diary():
    '''添加一篇新文章'''
    data = request.get_json()
    if not data:
        return bad_request('You must post JSON data.')
    message = {}
    if 'title' not in data or not data.get('title').strip():
        message['title'] = 'Title is required.'
    elif len(data.get('title')) > 255:
        message['title'] = 'Title must less than 255 characters.'
    if 'body' not in data or not data.get('body').strip():
        message['body'] = 'Body is required.'
    if message:
        return bad_request(message)

    diary = Diary()
    diary.from_dict(data)
    diary.author = g.current_user  # 通过 auth.py 中 verify_token() 传递过来的（同一个request中，需要先进行 Token 认证）
    db.session.add(diary)
    db.session.commit()
    response = jsonify(diary.to_dict())
    response.status_code = 201
    # HTTP协议要求201响应包含一个值为新资源URL的Location头部
    response.headers['Location'] = url_for('api.get_diary', id=diary.id)
    return response


@bp.route('/diaries/', methods=['GET'])
def get_diaries():
    """返回文章集合，分页"""
    page = request.args.get('page', 1, type=int)
    per_page = min(
        request.args.get(
            'per_page', current_app.config['POSTS_PER_PAGE'], type=int), 100)
    data = Diary.to_collection_dict(
        Diary.query.order_by(Diary.timestamp.desc()), page, per_page,
        'api.get_diaries')
    return jsonify(data)


@bp.route('/diaries/<int:id>', methods=['GET'])
def get_diary(id):
    '''返回一篇文章'''
    diary = Diary.query.get_or_404(id)
    diary.views += 1
    db.session.add(diary)
    db.session.commit()
    data = diary.to_dict()
    # 下一篇文章
    # next_basequery = Diary.query.order_by(Diary.timestamp.desc())\
    #     .filter(Diary.timestamp > diary.timestamp)
    # if next_basequery.all():
    #     data['next_id'] = next_basequery[-1].id
    #     data['next_title'] = next_basequery[-1].title
    #     data['_links']['next'] = url_for('api.get_diary', id=next_basequery[-1].id)
    # else:
    #     data['_links']['next'] = None
    # 上一篇文章
    # prev_basequery = Diary.query.order_by(Diary.timestamp.desc())\
    #     .filter(Diary.timestamp < diary.timestamp)
    # if prev_basequery.first():
    #     data['prev_id'] = prev_basequery.first().id
    #     data['prev_title'] = prev_basequery.first().title
    #     data['_links']['prev'] = url_for('api.get_diary', id=prev_basequery.first().id)
    # else:
    #     data['_links']['prev'] = None
    return jsonify(data)


@bp.route('/diaries/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_diary(id):
    '''修改一篇文章'''
    diary = Diary.query.get_or_404(id)
    if g.current_user != diary.author:
        return error_response(403)

    data = request.get_json()
    if not data:
        return bad_request('You must post JSON data.')
    message = {}
    if 'title' not in data or not data.get('title').strip():
        message['title'] = 'Title is required.'
    elif len(data.get('title')) > 255:
        message['title'] = 'Title must less than 255 characters.'
    if 'body' not in data or not data.get('body').strip():
        message['body'] = 'Body is required.'
    if message:
        return bad_request(message)

    diary.from_dict(data)
    db.session.commit()
    return jsonify(diary.to_dict())


@bp.route('/diaries/<int:id>', methods=['DELETE'])
@token_auth.login_required
def delete_diary(id):
    """删除一篇文章"""
    diary = Diary.query.get_or_404(id)
    if g.current_user != diary.author:
        return error_response(403)
    db.session.delete(diary)
    db.session.commit()
    return '', 204