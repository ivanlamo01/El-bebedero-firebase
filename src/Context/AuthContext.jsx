import React, { useState, useContext, useEffect } from "react";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
    const [login, setLogin] = useState(
        localStorage.getItem("login") ? true : false
    );
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || {}
    );
    const [tasks, setTasks] = useState(
        JSON.parse(localStorage.getItem("tasks")) || []
    );

    const handleLogin = (userInfo) => {
        localStorage.setItem("login", "true");
        setLogin(true);
        if (userInfo) {
            setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo));
            // Load tasks if available for the user
            if (userInfo.tasks) {
                setTasks(userInfo.tasks);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("login");
        localStorage.removeItem("user");
        localStorage.removeItem("tasks");
        setLogin(false);
        setUser({});
        setTasks([]);
    };

    const addTask = (description, deadline) => {
        const newTask = {
            id: Date.now(), // Generate a unique id based on timestamp
            description,
            deadline
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // Update the user object if necessary
        const updatedUser = { ...user, tasks: updatedTasks };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const removeTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));

        // Update the user object if necessary
        const updatedUser = { ...user, tasks: updatedTasks };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const getNextTask = () => {
        if (tasks.length === 0) return null;
        // Assuming the next task is the one with the earliest deadline
        return tasks.reduce((next, task) => {
            return (new Date(task.deadline) < new Date(next.deadline)) ? task : next;
        });
    };

    return (
        <AuthContext.Provider value={{ 
            login, 
            handleLogin, 
            handleLogout, 
            user, 
            tasks, 
            addTask, 
            removeTask, 
            getNextTask 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
