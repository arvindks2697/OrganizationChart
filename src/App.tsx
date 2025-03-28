import * as React from 'react'
import { TreeNode } from 'primereact/treenode';
import { initializeServer } from './server/main';
import { sampleData } from './data/sample';
import { buildNodeTree, fetchAllUsers } from './data/helper';
import { Employee } from './components/types';
import './App.css'
import { EmployeeList } from './components/EmployeeList';
import { Chart } from './components/Chart';


function App() {
  const [usersList, setUsersList] = React.useState<Employee[]>([])
  const [users, setUsers] = React.useState<TreeNode[]>(sampleData)
  const [userSelected, setUserSelected] = React.useState<boolean>(false)

  React.useEffect(() => {
    initializeServer();
    fetchAllUsers(setUsers, setUsersList);
  }, [])

  return (
    <div className="card overflow-x-auto w-full">
      <div className="grid">
        <div className="col-12 md:col-6 xl:col-2">
          <EmployeeList setUsers={setUsers} setList={setUsersList} list={usersList} setSelect={setUserSelected} selected={userSelected} />
        </div>
        <div className="col-12 md:col-6 xl:col-10">
          <Chart setUsers={setUsers} setList={setUsersList} users={users} select={userSelected} setSelect={setUserSelected} />
        </div>
      </div>
    </div >
  )
}

export default App