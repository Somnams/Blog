import rq
import rq_dashboard
from flask import Flask, request
from redis import Redis
from elasticsearch import Elasticsearch
from app.api import bp as api_bp
from app.extensions import cors, db, migrate, mail, babel


def create_app(config_class=None):
    """Factory Pattern: Create Flask app."""
    app = Flask(__name__)

    # Initialization flask app
    configure_app(app, config_class)
    configure_blueprints(app)
    configure_extensions(app)
    # 不使用 Jinja2，用不到模版过滤器和上下文处理器
    # configure_template_filters(app)
    # configure_context_processors(app)
    configure_before_handlers(app)
    configure_after_handlers(app)
    configure_errorhandlers(app)

    return app


def configure_app(app, config_class):
    app.config.from_object(config_class)
    # 不检查路由中最后是否有斜杠/
    app.url_map.strict_slashes = False
    # 整合RQ任务队列
    app.redis = Redis.from_url(app.config['REDIS_URL'])
    app.task_queue = rq.Queue('madblog-tasks', connection=app.redis, default_timeout=3600)
    # 设置任务队列中各任务的执行最大超时时间为 1 小时
    # Elasticsearch
    app.elasticsearch = Elasticsearch([app.config['ELASTICSEARCH_URL']]) \
        if app.config['ELASTICSEARCH_URL'] else None
    # Init Flask-Babel
    babel.init_app(app)

    @babel.localeselector
    def get_locale():
        return request.accept_languages.best_match(app.config['LANGUAGES'])


def configure_blueprints(app):
    # 注册 blueprint
    app.register_blueprint(api_bp, url_prefix='/api')
    app.config.from_object(rq_dashboard.default_settings)
    app.register_blueprint(rq_dashboard.blueprint, url_prefix="/rq")


def configure_extensions(app):
    """Configures the extensions."""
    # Enable CORS
    cors.init_app(app)
    # Init Flask-SQLAlchemy
    db.init_app(app)
    # Init Flask-Migrate
    migrate.init_app(app, db)
    # Init Flask-Mail
    mail.init_app(app)


def configure_before_handlers(app):
    """Configures the before request handlers"""
    pass


def configure_after_handlers(app):
    """Configures the after request handlers"""
    pass


def configure_errorhandlers(app):
    """Configures the error handlers"""
    pass
