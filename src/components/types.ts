export enum Designation {
    MANAGER = "manager",
    CONTRIBUTER = "contributer",
    CEO = "ceo",
    CTO = "cto",
    CAO = "cao",
    CBO = "cbo",
    DIRECTOR = "director",
    VP = "vicePresident",
}
export enum Team {
    MANAGEMENT = "management",
    MARKETING = "marketing",
    ENGINEERING = "engineering",
}

export interface Employee {
    id: number;
    name: string;
    designation: string;
    team: string
    manager: number | null;
    img: string
}

export const toolbarItems = [
    { name: 'Name', value: "name" },
    { name: 'Team', value: "team" },
    { name: 'Designation', value: "designation" }
];