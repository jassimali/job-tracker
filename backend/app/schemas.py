
from pydantic import BaseModel, EmailStr


class Application(BaseModel):
    company: str
    role: str
    status: str



class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str