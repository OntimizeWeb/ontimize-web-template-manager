const data = [
  {
    'id': 1,
    'img': '../../assets/images/template-images/template1.png',
    'description': 'Simple login page.',
    'type': 5
  },
  {
    'id': 2,
    'img': '../../assets/images/template-images/template2.png',
    'description': 'Simple grid example.',
    'type': 2
  },
  {
    'id': 2,
    'img': '../../assets/images/template-images/template1.png',
    'description': 'Fixed grid example.',
    'type': 2
  }
]

export class GridData {
  public static getData(attr: Array<number>) {
    return data.filter(function (o) {
      return attr.indexOf(o.type) != -1;
    })
  }
}