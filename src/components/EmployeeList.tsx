import React from "react";
import axios from "axios"
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { TreeNode } from 'primereact/treenode';
import { buildNodeTree } from '../data/helper';
import { Employee } from "./types";
import { Panel } from 'primereact/panel';
import { Toolbar } from "./Toolbar";

interface ListProps {
    setUsers: React.SetStateAction<any>,
    list: Employee[],
    setList: React.SetStateAction<any>,
    selected: boolean,
    setSelect: React.SetStateAction<any>
}

export const EmployeeList = (props: ListProps) => {
    const [selectedUser, setSelectedUser] = React.useState<TreeNode>();

    const onEmployeeSelect = (e: ListBoxChangeEvent) => {
        props.setSelect(true)
        const value = e.value;
        axios.get(`/api/users/${value.id}`)
            .then((res: any) => res.data)
            .then((data) => { setSelectedUser(e.value); buildNodeTree(data, props.setUsers); }).catch((err) => console.error(`The following error has occured ${err}`))
    }

    const ItemTemplate = (props: Employee) => {
        return <div className="grid">
            <div className="col-5">
                <img alt={props.name} src={props.img} className="w-4rem h-4rem " />
            </div>
            <div className="col-7">
                <div className="flex flex-column listItem align-items-start">
                    <div className="text-left">{props.name}</div>
                    <div className='my-1 p-text-primary text-small'>{props.designation?.length <= 3 ? props.designation.toLocaleUpperCase() : props.designation.slice(0, 1).toLocaleUpperCase() + props.designation.slice(1, props.designation.length)}</div>
                    <div className='text-small'>{props.team.slice(0, 1).toLocaleUpperCase() + props.team.slice(1, props.team.length)}</div>
                </div>
            </div>
        </div>
    }

    React.useEffect(() => {
        if (props.selected == false) setSelectedUser(undefined)
    }, [props.selected])

    return <Panel headerTemplate={() => <Toolbar setList={props.setList} setUsers={props.setUsers} setSelect={props.setSelect} />} className="employee-list-panel">
        <ListBox value={selectedUser} onChange={onEmployeeSelect} options={props.list} optionLabel="name" className="w-full" itemTemplate={ItemTemplate} listStyle={{ maxHeight: '690px' }} />
    </Panel>


}