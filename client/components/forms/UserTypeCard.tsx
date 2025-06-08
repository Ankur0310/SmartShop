import React from 'react';
import clsx from 'clsx';

interface Props {
  title: string;
  description: string;
  icon: string;
  selected?: boolean;
  onSelect: () => void;
}

export const UserTypeCard: React.FC<Props> = ({ title, description, icon, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'cursor-pointer p-5 rounded-2xl border transition-all shadow-sm',
        selected
          ? 'bg-white border-blue-500 ring-2 ring-blue-400 shadow-md'
          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
      )}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};
