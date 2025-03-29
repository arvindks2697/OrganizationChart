import React from "react"
import { OrganizationChart } from 'primereact/organizationchart';
import axios from "axios"
import { TreeNode } from 'primereact/treenode';
import { buildNodeTree, fetchAllUsers } from '../data/helper';
import { Panel } from 'primereact/panel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from "primereact/button";

interface ChartProps {
    setUsers: React.SetStateAction<any>,
    users: TreeNode[],
    setList: React.SetStateAction<any>,
    select: boolean,
    setSelect: React.SetStateAction<any>,
}

export const Chart = (props: ChartProps) => {
    const handleDragStart = (event: React.DragEvent, node: any) => {
        event.dataTransfer.setData("text/plain", node.key);
    };

    const handleDrop = (event: React.DragEvent, targetNode: any) => {
        event.preventDefault();
        const draggedId = Number(event.dataTransfer.getData("text/plain"));
        const targetId = targetNode?.key;
        axios.post(`/api/users/update`, { id: draggedId, tid: targetId })
            .then((res: any) => res.data)
            .then((data) => { buildNodeTree(data, props.setUsers); props.setList(data) }).catch((err) => console.error(`The following error has occured ${err}`))
    };

    const handleReset = () => {
        props.setSelect(false);
        fetchAllUsers(props.setUsers, props.setList);
    }

    const nodeTemplate = (node: TreeNode) => {
        return (<div
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, node)}
            className="p-2 border rounded-lg shadow-md cursor-move bg-white text-center"
        >
            <div className="flex flex-column align-items-center">
                <img alt={node.label} src={node?.data} className="mb-3 w-3rem h-3rem" />
                <span className="mb-2">{node.label}</span>
            </div>
        </div>)
    };

    return <Panel header="Organization Chart">
        <ScrollPanel style={{ width: '100%', height: '675px' }} className="org-chart-panel">
            {props?.select ? <Button label="View All" icon="pi pi-chevron-left" size="small" className="float-left mb-2 view-all" onClick={handleReset} tooltip="View all employees" tooltipOptions={{ position: "bottom" }} /> : ""}
            <OrganizationChart value={props.users} nodeTemplate={nodeTemplate} />
        </ScrollPanel >
    </Panel >
}