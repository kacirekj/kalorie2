import json
from concurrent.futures import ThreadPoolExecutor
from string import ascii_lowercase

import requests

nakombinovane_5_pismena = []

for a in ascii_lowercase:
    for b in ascii_lowercase:
        for c in ascii_lowercase:
            for d in ascii_lowercase:
                nakombinovane_5_pismena.append(a + b + c + d)

nakombinovane_5_pismena = sorted(nakombinovane_5_pismena)


for komb in nakombinovane_5_pismena:
    if komb < 'aaaa':
        continue

    def exec():
        str = f'https://nutridata.cz/Eatable/Search/?filter={komb}'
        res = requests.get(str)
        dic = res.json()

        with open('nutridata.json', 'r') as f:
            cont = f.read()
            cont: list[dict] = json.loads(cont)
            cont = [*cont, *dic]
            cont = json.dumps(cont, indent=2)

        with open('nutridata.json', 'w') as f:
            f.write(cont)

        print(f'{komb} - {len(dic)}')

