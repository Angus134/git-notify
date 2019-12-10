const team1 = {
    zhangsan: '张三'
}
const team2 = {
  zhangsan: '张三'
}
const team3 = {
  zhangsan: '张三'
}
const team = {
  team1,
  team2,
  team3
}
// 根据组别映射名称
export default function mappingMembers(teamName) {
  return team[teamName]
}
