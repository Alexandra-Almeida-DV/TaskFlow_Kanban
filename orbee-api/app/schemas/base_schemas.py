from pydantic import BaseModel, ConfigDict

class TunedBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    