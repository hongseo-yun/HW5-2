// src/components/Pages/ShowList.js
import React, { useState, useEffect, useCallback } from 'react';
import TaskCard from '../TaskCard';
import ModalForm from '../ModalForm';

const API = "https://6910cb5a7686c0e9c20bb7c5.mockapi.io/Tasks";

// Vanilla JS에서 사용했던 데이터 정규화 함수
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

    // 2. READ (데이터 불러오기) 로직
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

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // 3. DELETE (삭제) 로직
    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (res.ok) {
                // 삭제 후 목록 다시 불러오기
                fetchTasks();
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 요청 실패:", error);
        }
    };

    // 4. UPDATE (수정) 로직 (수정 모달 열기)
    const handleEdit = async (id) => {
        try {
            const res = await fetch(`${API}/${id}`);
            const raw = await res.json();
            const n = normalizeItem(raw);
            setCurrentTask(n); // 상태에 수정할 데이터 저장
            // jQuery를 사용하여 모달 열기
            $('#taskModal').modal('show');
            // ModalForm 컴포넌트가 currentTask를 감지하고 폼을 채울 것입니다.
        } catch (error) {
            console.error("수정할 Task 불러오기 실패:", error);
        }
    };

    // 5. CREATE (추가) 로직 (추가 모달 열기)
    const handleOpenAddModal = () => {
        setCurrentTask(null); // 추가 모드를 위해 null로 설정
        // jQuery를 사용하여 모달 열기
        $('#taskModal').modal('show');
    };

    // 6. ModalForm이 데이터를 성공적으로 저장했을 때 호출될 콜백
    const handleSaveSuccess = () => {
        // 데이터 저장 후 목록을 갱신합니다.
        fetchTasks();
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
                    {/* Task 목록 렌더링 */}
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
            
            {/* Modal Content - jQuery Modal 내부의 React 영역 */}
            {/* ModalFooter의 Save 버튼은 ModalForm 내부에서 처리 */}
            {/* 이 코드는 public/index.html의 #taskModal 내부의 <div id="modal-body-content">에 렌더링되어야 합니다. */}
            {/* Bootstrap Modal과 React State를 함께 사용할 때의 일반적인 패턴은, 
               HTML에 Modal 껍데기를 두고, React 컴포넌트가 그 껍데기 안에 렌더링되는 것입니다. 
               다만, 현재 구조에서는 ModalForm을 직접 Modal Body에 렌더링해야 합니다. 
               ModalForm을 문서 하단에 렌더링하고, jQuery를 사용해 폼 데이터를 채우는 방식 대신, 
               React 컴포넌트를 사용해 렌더링 구조를 변경하겠습니다. */}
            
            {/* ModalForm 컴포넌트를 직접 렌더링하고, Modal의 닫힘/열림을 제어합니다. */}
            {/* 모달 폼은 public/index.html의 div id="modal-body-content"에 수동으로 삽입될 수 없으므로,
                ShowList 컴포넌트 내부에 Modal 폼 내용을 렌더링하도록 구조를 변경해야 합니다. 
                (Bootstrap 5.x의 React 통합 라이브러리인 react-bootstrap을 사용하지 않는 경우) */}
            
            <div id="modal-container">
                {/* ModalForm을 Modal의 body와 footer를 대체하는 형태로 렌더링 */}
                <ModalForm 
                    currentTask={currentTask} 
                    onSaveSuccess={handleSaveSuccess} 
                />
            </div>
        </>
    );
};

export default ShowList;