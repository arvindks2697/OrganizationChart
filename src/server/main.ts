import { createServer } from "miragejs";
import { employeeData } from "../data/employee";
import { Employee } from "../components/types";

class EmployeeList {
  private employees: Employee[];

  constructor() {
    this.employees = employeeData;
  }

  public getAll(): Employee[] {
    return this.employees;
  }

  public setAll(updatedEmployees: Employee[]): void {
    this.employees = updatedEmployees;
  }

  public findById(empId: number): Employee | undefined {
    return this.employees.find((emp) => emp.id === empId);
  }

  public filterByTeam(team: string): Employee[] {
    return this.employees.filter((emp) => emp.team === team);
  }

  public filterByName(name: string): Employee[] {
    const regex = new RegExp(`^.*${name.trim()}.*$`, "i");
    return this.employees.filter((emp) => regex.test(emp.name));
  }

  public filterByDesignation(designation: string): Employee[] {
    return this.employees.filter((emp) => emp.designation === designation);
  }
}

export const initializeServer = () => {
  const empList = new EmployeeList();

  const getManagerHierarchy = (employee: Employee): Employee[] => {
    const managers: Employee[] = [];
    while (employee?.manager !== null) {
      employee = empList.findById(employee.manager)!;
      if (employee) managers.push(employee);
    }
    return managers;
  };

  createServer({
    routes() {
      this.get("/api/users", () => empList.getAll());

      this.get("/api/users/:id", (_schema, request) => {
        const id = parseInt(request.params.id, 10);
        const employee = empList.findById(id);
        if (!employee) {
          return { error: "Employee not found" };
        }
        return [...getManagerHierarchy(employee), employee].sort((a, b) => a.id - b.id);
      });

      this.post("/api/users/filter", (_schema, request) => {
        try {
          const { team, name, designation } = JSON.parse(request.requestBody);

          if (team) {
            const filteredEmployees = empList.filterByTeam(team);
            const managers = new Map<number, Employee>();

            filteredEmployees.forEach((employee) => {
              if (employee.manager) {
                getManagerHierarchy(employee).forEach((manager) => managers.set(manager.id, manager));
              }
            });

            return {
              employees: filteredEmployees,
              managers: Array.from(managers.values()).sort((a, b) => a.id - b.id),
            };
          }

          if (name) return empList.filterByName(name);
          if (designation) return empList.filterByDesignation(designation);

          return empList.getAll();
        } catch {
          return { error: "Invalid request payload" };
        }
      });

      this.post("/api/users/update", (_schema, request) => {
        try {
          const { id, tid } = JSON.parse(request.requestBody);
          const currentEmployee = empList.findById(id);
          const employees = empList.getAll();

          if (currentEmployee && currentEmployee.manager == null) {
            const rootReportees = employees.filter((emp) => emp.manager === id);

            if (rootReportees.length > 0) {
              rootReportees[0].manager = null;
              rootReportees.forEach((emp) => {
                if (emp.manager !== null) {
                  emp.manager = rootReportees[0].id;
                }
              });
            }
          }

          const updatedEmployees = employees.map((emp) =>
            emp.id === id ? { ...emp, manager: tid } : emp
          );

          empList.setAll(updatedEmployees);
          return empList.getAll();
        } catch {
          return { error: "Invalid request payload" };
        }
      });
    },
  });
};
