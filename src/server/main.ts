import { createServer } from "miragejs";
import { employeeData } from "../data/employee";
import { Employee } from "../components/types";

export const initializeServer = () => {
  const findEmployeeById = (empId: number): Employee | undefined =>
    employeeData.find((emp) => emp.id === empId);

  const getManagerHierarchy = (employee: Employee): Employee[] => {
    const managers: Employee[] = [];
    while (employee?.manager !== null) {
      employee = findEmployeeById(employee.manager)!;
      if (employee) managers.push(employee);
    }
    return managers;
  };

  createServer({
    routes() {
      this.get("/api/users", () => employeeData);

      this.get("/api/users/:id", (_schema, request) => {
        const id = parseInt(request.params.id, 10);
        const employee = findEmployeeById(id);
        if (!employee) return { error: "Employee not found" };

        const managers = getManagerHierarchy(employee);
        return [...managers, employee].sort((a, b) => a.id - b.id);
      });

      this.post("/api/users/filter", (_schema, request) => {
        try {
          const params = JSON.parse(request.requestBody);

          if (params.team) {
            const managers = new Map<number, Employee>();
            const filteredEmployees = employeeData.filter(
              (emp) => emp.team === params.team
            );

            filteredEmployees.forEach((employee) => {
              if (employee.manager) {
                getManagerHierarchy(employee).forEach((manager) => {
                  managers.set(manager.id, manager);
                });
              }
            });

            return {
              employees: filteredEmployees,
              managers: Array.from(managers.values()).sort((a, b) => a.id - b.id),
            };
          }

          if (params.name) {
            return employeeData.filter((emp) =>
              new RegExp(`^.*${params.name.trim()}.*$`, "i").test(emp.name)
            );
          }

          if (params.designation) {
            return employeeData.filter((emp) => emp.designation === params.designation);
          }

          return employeeData;
        } catch (error) {
          return { error: "Invalid request payload" };
        }
      });

      this.post("/api/users/update", (_schema, request) => {
        try {
          const attrs = JSON.parse(request.requestBody);
          const currentEmployee = findEmployeeById(attrs.id);

          if (currentEmployee && !currentEmployee.manager) {
            const rootReportees = employeeData.filter((emp) => emp.manager === attrs.id);
            if (rootReportees.length > 0) {
              rootReportees[0].manager = null;
              rootReportees.forEach((emp) => {
                if (emp.manager !== null) {
                  emp.manager = rootReportees[0].id;
                }
              });
            }
          }

          return employeeData.map((emp) =>
            emp.id === attrs.id ? { ...emp, manager: attrs.tid } : emp
          );
        } catch (error) {
          return { error: "Invalid request payload" };
        }
      });
    },
  });
};