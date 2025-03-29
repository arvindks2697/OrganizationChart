import { TreeNode } from "primereact/treenode";
import { Employee } from "../components/types";
import { SetStateAction } from "react";
import axios from "axios";

export const buildNodeTree = (data: Employee[], setUsers: SetStateAction<any>): void => {
    const map = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    data.forEach(emp => {
        const node: TreeNode = {
            label: emp.name,
            key: emp.id,
            expanded: true,
            children: [],
            data: emp.img
        };
        map.set(emp.id, node);
    });

    data.forEach((emp: Employee) => {
        if (roots.length == 0) {
            roots.push(map.get(emp.id)!);
        }
        const parent = map.get(emp.manager!);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(map.get(emp.id)!);
        }
    });
    setUsers(roots);
}

export const fetchAllUsers = async (setUsers: React.SetStateAction<any>, setList: React.SetStateAction<any>) => {
    try {
        const response = await axios.get("/api/users");
        const data = response.data;
        buildNodeTree(data, setUsers);
        setList(data)
    } catch (err) {
        console.log(`The following error has occured ${err}`)
    }
};