export class Storage {
  static get(sourceName) {
    const list = JSON.parse(localStorage.getItem(sourceName));
    return list ?? [];
  }

  static add(targetName, entity) {
    const list = this.get(targetName);
    entity.uid = +new Date();
    list.push(entity);
    localStorage.setItem(targetName, JSON.stringify(list));

    //text.value = '';
    return list;
  }

  static delete(sourceName, uid) {
    const entities = this.get(sourceName).filter((item) => item.uid != uid);
    localStorage.setItem(sourceName, JSON.stringify(entities));
  }

  static update(targetName, entity) {
    // (task, index)
    const entities = this.get(targetName);
    const targetEntityIndex = entities.findIndex((item) => item.uid == entity.uid);
    entities[targetEntityIndex] = { ...entity }; // ... ? что это?
    localStorage.setItem(targetName, JSON.stringify(entities));
  }
}
