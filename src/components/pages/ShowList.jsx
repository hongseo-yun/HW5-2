// src/components/pages/ShowList.js
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
    // 1. 상태(State) 관리
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null); // 수정할 Task 데이터 (null이면 추가 모드)
    
    // 2. Ref 사용: DOM 요소(Modal)에 직접 접근하기 위한 훅
    const modalRef = useRef(null); 

    // 3. READ (데이터 불러오기) 로직
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

    // 4. DELETE (삭제) 로직
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

    // 5. UPDATE (수정) 로직 (수정 모달 열기)
    const handleEdit = async (id) => {
        try {
            const res = await fetch(`${API}/${id}`);
            const raw = await res.json();
            const n = normalizeItem(raw);
            setCurrentTask(n); // 상태에 수정할 데이터 저장
            
            // Ref를 통해 Modal을 엽니다. (Bootstrap JS 호출)
            if (modalRef.current) {
                window.$(modalRef.current).modal('show');
            }
        } catch (error) {
            console.error("수정할 Task 불러오기 실패:", error);
        }
    };

    // 6. CREATE (추가) 로직 (추가 모달 열기)
    const handleOpenAddModal = () => {
        setCurrentTask(null); // 추가 모드를 위해 null로 설정
        // Ref를 통해 Modal을 엽니다.
        if (modalRef.current) {
            window.$(modalRef.current).modal('show');
        }
    };

    // 7. ModalForm이 데이터를 성공적으로 저장했을 때 호출될 콜백
    const handleSaveSuccess = () => {
        fetchTasks();
        // ModalForm에서 모달 닫기를 이미 처리했으므로 여기서는 추가 작업 불필요
    }

    return (
        <>
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header"><a className="navbar-brand" href="#">CRUD-React</a></div>
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
            
            {/* ModalForm 컴포넌트를 렌더링하고, ref를 전달합니다. */}
            <ModalForm 
                ref={modalRef} // Ref 연결
                currentTask={currentTask} 
                onSaveSuccess={handleSaveSuccess} 
            />
        </>
    );
};

export default ShowList;