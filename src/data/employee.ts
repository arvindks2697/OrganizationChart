import { Designation, Team } from '../components/types';

export const employeeData = [
    { id: 0, name: "Mark Hill", "designation": Designation.CEO, manager: null, team: Team.MANAGEMENT,"img":"https://avatar.iran.liara.run/public/15" },
    { id: 1, name: "Joe Linux", "designation": Designation.CTO, manager: 0, team: Team.MANAGEMENT,"img":"https://avatar.iran.liara.run/public/29" },
    { id: 2, name: "Linda May", "designation": Designation.CBO, manager: 0, team: Team.MANAGEMENT,"img":"https://avatar.iran.liara.run/public/63" },
    { id: 3, name: "John Green", "designation": Designation.CAO, manager: 0, team: Team.MANAGEMENT,"img":"https://avatar.iran.liara.run/public/8" },
    { id: 4, name: "Ron Blomquist", "designation": Designation.CONTRIBUTER, manager: 1, team: Team.MARKETING,"img":"https://avatar.iran.liara.run/public/48g" },
    { id: 5, name: "Michael Rubin", "designation": Designation.CONTRIBUTER, manager: 1, team: Team.MARKETING,"img":"https://avatar.iran.liara.run/public/3" },
    { id: 6, name: "Alice Lopez", "designation": Designation.CONTRIBUTER, manager: 2, team: Team.MARKETING,"img":"https://avatar.iran.liara.run/public/77" },
    { id: 7, name: "Mary Johnson", "designation": Designation.CONTRIBUTER, manager: 2, team: Team.ENGINEERING,"img":"https://avatar.iran.liara.run/public/91" },
    { id: 8, name: "Kirk Douglas", "designation": Designation.CONTRIBUTER, manager: 2, team: Team.ENGINEERING,"img":"https://avatar.iran.liara.run/public/4" },
    { id: 9, name: "Erica Reel", "designation": Designation.CONTRIBUTER, manager: 3, team: Team.ENGINEERING,"img":"https://avatar.iran.liara.run/public/94" },
]