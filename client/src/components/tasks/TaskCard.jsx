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
      className={`group bg-white border border-[#E5EAF2] hover:border-[#5B5FEF]/40 rounded-2xl p-4 sm:p-4.5 transition-all duration-200 shadow-card hover:shadow-card-hover flex flex-col justify-between gap-3 font-sans ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Top Header: Project badge & Priority badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 truncate">
          {task.project && (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg truncate border shadow-subtle"
              style={{
                backgroundColor: `${task.project.color || '#5B5FEF'}15`,
                color: task.project.color || '#5B5FEF',
                borderColor: `${task.project.color || '#5B5FEF'}30`,
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
          className="text-sm font-bold text-[#202B42] hover:text-[#5B5FEF] transition-colors cursor-pointer line-clamp-2 tracking-tight"
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-[#68758B] line-clamp-2 mt-1 leading-relaxed font-normal">
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
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F0EFFF] text-[#5B5FEF] border border-[#E4E2FF]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Due date, comments, and actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EAF2] text-xs">
        <div className="flex items-center gap-3">
          {formattedDueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isOverdue
                  ? 'text-[#DC5265] font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200'
                  : 'text-[#68758B]'
              }`}
              title={isOverdue ? 'Overdue!' : 'Due date'}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-[#DC5265]" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[#96A0B2]" />
              )}
              {formattedDueDate}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-[#68758B] font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-[#96A0B2]" />
              {task.comments.length}
            </span>
          )}
        </div>

        {/* Action icons / Quick status selector */}
        <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="text-[11px] font-semibold bg-[#F7F9FC] border border-[#E5EAF2] rounded-lg px-2 py-0.5 text-[#202B42] focus:outline-none focus:border-[#5B5FEF]"
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
              className="p-1 rounded-lg text-[#68758B] hover:text-[#5B5FEF] hover:bg-[#F0EFFF] transition-colors"
              title="Edit Task"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1 rounded-lg text-[#68758B] hover:text-[#DC5265] hover:bg-rose-50 transition-colors"
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
