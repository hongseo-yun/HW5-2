// src/components/ModalForm.js
import React, { useState, useEffect } from 'react';

const API = "https://6910cb5a7686c0e9c20bb7c5.mockapi.io/Tasks";

const ModalForm = ({ currentTask, onClose, onSaveSuccess }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    dueDay: '',
    detail: '',
    finish: '',
    priority: '',
    category: '',
  });

  // currentTask가 변경될 때마다 폼 데이터 업데이트 (수정 모드)
  useEffect(() => {
    if (currentTask) {
      setTaskData({
        title: currentTask.title || '',
        dueDay: currentTask.dueDay || '',
        detail: currentTask.detail || '',
        finish: currentTask.finish || '',
        priority: currentTask.priority || '',
        category: currentTask.category || '',
      });
      // Modal Title 업데이트
      $('#modalTitle').text(currentTask.id ? "Modify Task" : "New Task");
    } else {
      // 추가 모드일 경우 필드 초기화
      setTaskData({ title: '', dueDay: '', detail: '', finish: '', priority: '', category: '' });
      $('#modalTitle').text("New Task");
    }
  }, [currentTask]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTaskData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!taskData.title || !taskData.dueDay) {
      alert("Title과 Due Day는 필수입니다.");
      return;
    }

    const method = currentTask && currentTask.id ? "PUT" : "POST";
    const url = currentTask && currentTask.id ? `${API}/${currentTask.id}` : API;
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        // 성공 후 부모 컴포넌트에 알림
        onSaveSuccess();
        // 부트스트랩 모달 닫기
        $('#taskModal').modal('hide'); 
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }
  };

  // 기존 HTML 구조를 React 컴포넌트로 변환하여 반환
  // Note: HTML에 있는 #saveBtn을 React에서 제어하기 위해 <div> 구조를 그대로 사용하고 이벤트만 React 함수로 연결합니다.
  return (
    <>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" className="form-control" value={taskData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="dueDay">Due Day</label>
          <input type="date" id="dueDay" className="form-control" value={taskData.dueDay} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="detail">Detail</label>
          <input type="text" id="detail" className="form-control" value={taskData.detail} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="finish">Finish</label>
          <select id="finish" className="form-control" value={taskData.finish} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" className="form-control" value={taskData.priority} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" className="form-control" value={taskData.category} onChange={handleChange} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-success" onClick={handleSave}>Save</button>
        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </>
  );
};

export default ModalForm;