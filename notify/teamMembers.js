const webTeam = {
    JIA: '王佳',
    FENG: '丹凤',
    MEI: '淑美',
    PING: '吴平',
    HAO: '陈浩',
    NGUS: '吴平',
}
const winTeam = {
    JIA: '王佳',
    FENG: '丹凤',
    MEI: '淑美',
    PING: '吴平',
    HAO: '陈浩',
    NGUS: '吴平',
}
const macTeam = {
    JIA: '王佳',
    FENG: '丹凤',
    MEI: '淑美',
    PING: '吴平',
    HAO: '陈浩',
    NGUS: '吴平',
}
const team = {
  windows: winTeam,
  mac: macTeam,
  web: webTeam
}
// 根据组别映射名称
export default function mappingMembers(teamName) {
  return team[teamName]
}
