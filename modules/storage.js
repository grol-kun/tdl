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
    const list = this.get(targetName).filter((item) => item.uid !== uid); 
    localStorage.setItem(targetName, JSON.stringify(list));
  }

  static update(targetName, entity) {
    const list = this.get(targetName);
    const targetEntityIndex = list.findIndex((item) => item.uid === entity.uid); 
    list[targetEntityIndex] = { ...entity }; 
    localStorage.setItem(targetName, JSON.stringify(list));
  }
}
