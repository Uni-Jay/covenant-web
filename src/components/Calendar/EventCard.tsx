import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa';

interface EventCardProps {
  id: number;
  title: string;
  description?: string;
  event_date: string | Date;
  event_type: 'activity' | 'birthday' | 'service' | 'meeting' | 'anniversary';
  created_by?: string;
  daysUntil?: number;
  onClick?: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getEventTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    activity: 'bg-blue-100 text-blue-700 border-blue-300',
    birthday: 'bg-pink-100 text-pink-700 border-pink-300',
    service: 'bg-purple-100 text-purple-700 border-purple-300',
    meeting: 'bg-green-100 text-green-700 border-green-300',
    anniversary: 'bg-red-100 text-red-700 border-red-300',
  };
  return colors[type] || colors.activity;
};

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  event_date,
  event_type,
  created_by,
  daysUntil,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const date = new Date(event_date);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getEventTypeColor(event_type)}`}>
              {event_type.charAt(0).toUpperCase() + event_type.slice(1)}
            </span>
            {daysUntil !== undefined && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {daysUntil === 0 ? 'Today' : `${daysUntil} days away`}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {description && <p className="text-gray-600 text-sm mb-3">{description}</p>}

      <div className="flex gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <FaCalendar className="text-blue-500" />
          <span>{dateStr}</span>
        </div>
        {created_by && (
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-500" />
            <span>{created_by}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
