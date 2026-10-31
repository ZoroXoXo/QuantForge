from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite:///./quantforge.db"

engine = create_engine(#connects SQAlchemy to SQLite
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(#Creates db sessions
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase): #Parent class for all db models
    pass


def get_db():#provides a database session to fastAPI endpoints and closes it afterwards
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()