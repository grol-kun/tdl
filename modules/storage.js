export class Storage {
  static get(targetName) {
    const list = JSON.parse(localStorage.getItem(targetName));
    return list ?? [];
  }

  static add(targetName, entity) {
    const list = this.get(targetName);
    entity.uid = +new Date();
    list.push(entity);
    localStorage.setItem(targetName, JSON.stringify(list));
    return list;
  }

  static delete(targetName, uid) {
    const entities = this.get(targetName).filter((item) => item.uid != uid);
    localStorage.setItem(targetName, JSON.stringify(entities));
  }

  static update(targetName, entity) {
    const entities = this.get(targetName);
    const targetEntityIndex = entities.findIndex((item) => item.uid == entity.uid);
    entities[targetEntityIndex] = { ...entity };  //что это?
    localStorage.setItem(targetName, JSON.stringify(entities));
  }
}
