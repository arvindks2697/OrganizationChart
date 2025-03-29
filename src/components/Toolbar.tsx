import React from "react";
import axios from "axios"
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Designation, Team, toolbarItems as items } from './types';
import { OverlayPanel } from 'primereact/overlaypanel';
import { buildNodeTree, fetchAllUsers } from "../data/helper";

interface ToolbarProps {
    setUsers: React.SetStateAction<any>,
    setList: React.SetStateAction<any>,
    setSelect: React.SetStateAction<any>
}

export const Toolbar = (props: ToolbarProps) => {
    const [filterOption, setFilterOption] = React.useState<any>("");
    const [filterValue, setFilterValue] = React.useState<string>('');
    const op = React.useRef<any>(null);
    const onFilter = (e: any) => {
        setFilterValue("")
        let data: string = e.value ?? e.target.value;
        setFilterValue(data)
        axios.post(`/api/users/filter`, { [filterOption]: data })
            .then((res: any) => res.data).then((data) => {
                if (filterOption == "team") {
                    props.setList([...data.employees])
                    buildNodeTree([...data.managers, ...data.employees].sort(), props.setUsers)
                } else
                    props.setList(data)
            })
            .catch((err) => console.error(`The following error has occured ${err}`))
    }

    const onClear = () => {
        setFilterValue("");
        setFilterOption("")
        props.setSelect(false)
        fetchAllUsers(props.setUsers, props.setList);
    }
    const handleMenuOpen = (e: React.MouseEvent) => {
        if (op.current) op?.current?.toggle(e)
    }
    const getSearchBarTemplate = () => {
        if (filterOption == "team") {
            return <Dropdown value={filterValue} onChange={onFilter} options={Object.values(Team)} optionLabel="team"
                placeholder="Select a team" className="w-8 no-border-radius" />
        }
        if (filterOption == "designation") {
            return <Dropdown value={filterValue} onChange={onFilter} options={Object.values(Designation)} optionLabel="designation"
                placeholder="Select a designation" className="w-8 no-border-radius" />
        }
        if (filterOption == "name") {
            return <InputText value={filterValue} onChange={onFilter} placeholder="Enter the full name" className="w-8 no-border-radius" />
        }
        // return <div className='placeholder-div'></div>
    }


    return <div className="toolbar w-full">
        <div className="flex flex-column align-items-start w-full">
            <div className="flex justify-content-start w-full">
                <Button icon="pi pi-filter" rounded text onClick={handleMenuOpen} tooltip="Filter Options" tooltipOptions={{ position: "top" }} className="w-2" />
                {getSearchBarTemplate()}
                {filterOption ? <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={onClear} className="w-2" /> : ""}
                <OverlayPanel ref={op}>
                    <div className="text-primary mb-3">Filter By:</div>
                    <SelectButton value={filterOption} onChange={(e) => setFilterOption(e.value)} optionLabel="name" options={items} />
                </OverlayPanel>
            </div>
        </div>
    </div>
}