import React, { useState, useEffect, useCallback, useRef } from 'react';
import TaskCard from '../TaskCard';
import ModalForm from '../ModalForm';

const API = "https://6910cb5a7686c0e9c20bb7c5.mockapi.io/Tasks";

const normalizeItem = (item) => {
    return {
        id: item.id || "",
        title: item.title || item.Title || "",
        dueDay: item.dueDay || item.DueDay || item.due || item.Due || "",
        detail: item.detail || item.Detail || "",
        finish: item.finish || item.Finish || "",
        priority: item.priority || item.Priority || "",
        category: item.category || item.Category || ""
    };
};

const ShowList = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null); 
    const modalRef = useRef(null); 

    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            const normalized = data.map(normalizeItem);
            setTasks(normalized);
            console.log("Task 목록 불러오기 완료");
        } catch (error) {
            console.error("데이터를 불러오는 데 실패했습니다:", error);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchTasks();
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 요청 실패:", error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const res = await fetch(`${API}/${id}`);
            const raw = await res.json();
            const n = normalizeItem(raw);
            setCurrentTask(n); 
            
            if (modalRef.current) {
                window.$(modalRef.current).modal('show');
            }
        } catch (error) {
            console.error("수정할 Task 불러오기 실패:", error);
        }
    };

    const handleOpenAddModal = () => {
        setCurrentTask(null); 
        if (modalRef.current) {
            window.$(modalRef.current).modal('show');
        }
    };

    const handleSaveSuccess = () => {
        fetchTasks();
    }

    return (
        <>
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">CRUD-React</a>
                    </div>
                </div>
            </nav>

            <div className="container">
                <h2>CRUD Program</h2>
                <button 
                    id="openAddModal" 
                    className="btn btn-success" 
                    onClick={handleOpenAddModal}
                >
                    Add
                </button>
                <button 
                    id="btnStu" 
                    className="btn btn-primary" 
                    onClick={fetchTasks}
                    style={{ marginLeft: '5px' }}
                >
                    Bring Data
                </button>

                <div id="itemList" style={{ marginTop: '20px' }}>
                    {tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    ))}
                </div>
            </div>
            
            <ModalForm 
                ref={modalRef} 
                currentTask={currentTask} 
                onSaveSuccess={handleSaveSuccess} 
            />
        </>
    );
};

export default ShowList;