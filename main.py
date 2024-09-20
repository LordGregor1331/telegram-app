# -*- coding: utf-8 -*-
from website import create_app

application = create_app()

if __name__ == '__main__':
    try:
        application.run(debug=True, use_reloader=True)
    except Exception as error:
        pass

