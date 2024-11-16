from fastapi import Request


def str2bool(value: str):
    if value.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif value.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    raise ValueError(f'Boolean value expected. {value}')


def reconstruct_base_url(request: Request) -> str:
    proto = request.headers.get('x-forwarded-proto', 'http')
    host = request.headers.get('x-forwarded-host', request.headers.get('host', 'localhost'))
    return f'{proto}://{host}'
