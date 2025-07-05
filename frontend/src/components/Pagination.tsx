import styles from './Pagination.module.css';

type Props = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, hasPrev, hasNext, onPageChange }: Props) => {
  return (
    <div className={styles.pagination}>
      <button onClick={() => onPageChange(page - 1)} disabled={!hasPrev}>
        Назад
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={!hasNext}>
        Вперёд
      </button>
    </div>
  );
};
