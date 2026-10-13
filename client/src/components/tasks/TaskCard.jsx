import React from 'react';
import { Badge } from '../common/Badge';
import { Calendar, MessageSquare, AlertCircle, Edit, Trash2 } from 'lucide-react';

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  draggable = false,
  onDragStart,
}) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`group bg-[#111B30] border border-[#263449] hover:border-[#8B5CF6]/50 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-card flex flex-col justify-between gap-3 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Top Header: Project badge & Priority badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          {task.project && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md truncate border border-[#263449]"
              style={{
                backgroundColor: `${task.project.color || '#8B5CF6'}15`,
                color: task.project.color || '#8B5CF6',
              }}
            >
              {task.project.name}
            </span>
          )}
        </div>
        <Badge variant={task.priority} size="sm">
          {task.priority}
        </Badge>
      </div>

      {/* Title & Description */}
      <div>
        <h4
          onClick={() => onEdit && onEdit(task)}
          className="text-sm font-semibold text-[#F8FAFC] hover:text-[#22D3EE] transition-colors cursor-pointer line-clamp-2"
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags if any */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[#17233B] text-[#94A3B8]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Due date, comments, and actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#263449]/70 text-xs">
        <div className="flex items-center gap-3">
          {formattedDueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isOverdue ? 'text-[#FB7185]' : 'text-[#94A3B8]'
              }`}
              title={isOverdue ? 'Overdue!' : 'Due date'}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#FB7185]" />
              ) : (
                <Calendar className="w-3.5 h-3.5" />
              )}
              {formattedDueDate}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
              <MessageSquare className="w-3.5 h-3.5" />
              {task.comments.length}
            </span>
          )}
        </div>

        {/* Action icons / Quick status selector */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="text-[11px] bg-[#17233B] border border-[#263449] rounded px-1.5 py-0.5 text-[#94A3B8] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Prog</option>
              <option value="in_review">Review</option>
              <option value="completed">Done</option>
            </select>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded text-[#94A3B8] hover:text-[#8B5CF6] hover:bg-[#17233B]"
              title="Edit Task"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1 rounded text-[#94A3B8] hover:text-[#FB7185] hover:bg-rose-500/10"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
