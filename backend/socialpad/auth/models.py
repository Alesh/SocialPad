import re
import typing as t

from pydantic import BaseModel, Field, model_validator


class AuthInfo(BaseModel):
    user_id: int
    scope: list[str]
    provider: str = 'VKID'
    access_token: str = None


class AuthConfig(BaseModel):
    client_id: int
    redirect_uri: str
    provider: str
    scope: list[str]


class StartParams(BaseModel):
    code_verifier: str
    comeback_uri: str


class StartResponse(BaseModel):
    client_id: int
    redirect_uri: str
    code_challenge: str
    state: str
    scope: list[str] = Field(default_factory=list)
    response_type: str = 'code'
    code_challenge_method: str = 's256'


class ContinueParams(BaseModel):
    client_id: int
    code_verifier: str
    device_id: str
    code: str
    redirect_uri: str
    state: str
    grant_type: str = 'authorization_code'

"""
client_id: 52620301
code_verifier: sjtBTHRcUeYNTUTW2FsRAQn-69F1BHwOWcF4ALeS
device_id: 75e0UzyJSH1nhcjZyfU1ukj1iqdD3akK1VEdeVsP6fwAJvPWJcUAyw8WeVUO_iGj7Fv2WOcU7UlidyvE9QLsrQ
code: vk2.a.FBUEVOH0LU9im8m-g-RYvM0bEU7iYkOC8HRdgtAY58tUIfQZymdIk38zx6Ganq0JoraqE04jsokRaC4u7rK61nrmel0_PVoTu1a0d44GQYGHn1PsGfeobc6hXqLnXpawUfW4TqYsY-vXF9B7XJ7VcOdarbUbQkyXrtYIVaYUslR6n9zyHPzEzMzaNO2FtIWBul7O2LhM2bjmPBMTa5tphDTIpgtL0VVGZjcjKmXChvs
redirect_uri: https://socialpad.ru/-vk/standalone/waatp/auth/token
state: _wwsNz60xOETbEjzOMle5y5dU6lEPrRNMWaAaELG
grant_type: authorization_code
"""

"""
{
'client_id': 52620301, 
'code_verifier': '5XBpZoH52TDRHcsK9QmU5ptZrPtDWo7v16T0see4', 
'device_id': '90JeVIhJp1DWp8aAJhSNXlxHhJZuKIy5cBPKHPndIM0adzMSQxFoUPJIkJycyXuVNsPgrUw1hlv48aOwWvUYog', 
'code': 'vk2.a.5-Xpdb8x6EKGFPxnwRj-xRMss927NCRLCp6_rH4-D5MNs2VyoS9I3L0Qf4lNroLWUUIXlH6QcnA1vA94B3WMxppxmihpJGjuCKESQ1yBVPn4TekP8zxRLo2c5dcWBH0ax13QlodFO8YDqrryFDjrobvNToqT_Ufah_UTHaWuxhb3sQOn0r0CHKZ-J4T6QoiuQteNfWuz-2aUhHWP_Pu327LqlL2KZOiCUoJuz7qmyAM', 
'redirect_uri': 'https://socialpad.ru/-vk/standalone/waatp', 
'state': 'pfCebCr47EhldGSi88g2yf8VPE8iKfQxHNVtttaa'}

"""


class TokenData(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    id_token: str
    expires_in: int
    user_id: int
    state: str
    scope: list[str] = Field(default_factory=list)
    frontend_token: bool = True
    provider: str = 'VK'

    @model_validator(mode='before')
    @classmethod
    def scope_validator(cls, data: dict[str, t.Any]) -> dict[str, t.Any]:
        scope = data.pop('scope', '')
        return dict(**data, scope=([a for a in re.split(r'[\s,]', scope) if a] if isinstance(scope, str) else scope))
