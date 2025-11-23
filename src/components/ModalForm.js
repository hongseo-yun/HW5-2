import React, { useState, useEffect } from 'react';

const API = "https://6910cb5a7686c0e9c20bb7c5.mockapi.io/Tasks";


const ModalForm = React.forwardRef(({ currentTask, onSaveSuccess }, ref) => {
  const [taskData, setTaskData] = useState({
    title: '',
    dueDay: '',
    detail: '',
    finish: '',
    priority: '',
    category: '',
  });
  

  const [modalTitle, setModalTitle] = useState('New Task');


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
      setModalTitle(currentTask.id ? "Modify Task" : "New Task");
    } else {
  
      setTaskData({ title: '', dueDay: '', detail: '', finish: '', priority: '', category: '' });
      setModalTitle("New Task");
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
        onSaveSuccess();
        if (ref.current) {
          window.$(ref.current).modal('hide');
        }
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }
  };

  const handleClose = () => {
    if (ref.current) {
      window.$(ref.current).modal('hide');
    }
  };

  return (
    <div id="taskModal" className="modal fade" role="dialog" ref={ref}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <button type="button" className="close" onClick={handleClose}>&times;</button>
            <h4 id="modalTitle">{modalTitle}</h4>
          </div>

          <div className="modal-body">
            <input type="hidden" id="taskId" value={currentTask ? currentTask.id : ''} /> 

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
            <button type="button" className="btn btn-default" onClick={handleClose}>Close</button>
          </div>

        </div>
      </div>
    </div>
  );
});

export default ModalForm;