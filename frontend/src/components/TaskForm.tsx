import { useEffect } from 'react';
import styles from './TaskForm.module.css';
import { useTaskStore } from '@/store/taskStore';

export const TaskForm = () => {
  const {
    formData,
    formErrors,
    loading,
    error,
    success,
    setFormField,
    setFormError,
    removeFormError,
    clearForm,
    validateForm,
    createTaskInStore,
    clearSuccess,
  } = useTaskStore();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await createTaskInStore({
      username: formData.username,
      email: formData.email,
      text: formData.text,
      status: false,
      isEdited: false,
    });

    clearForm();
  };

  const handleFieldBlur = (field: keyof typeof formData) => {
    const value = formData[field];

    switch (field) {
      case 'username':
        if (!value.trim()) {
          setFormError('username', 'Имя обязательно');
        } else {
          removeFormError('username');
        }
        break;
      case 'email':
        if (!value.trim()) {
          setFormError('email', 'Email обязателен');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setFormError('email', 'Email не валиден');
        } else {
          removeFormError('email');
        }
        break;
      case 'text':
        if (!value.trim()) {
          setFormError('text', 'Текст задачи обязателен');
        } else {
          removeFormError('text');
        }
        break;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Имя"
            value={formData.username}
            onChange={(e) => setFormField('username', e.target.value)}
            onBlur={() => handleFieldBlur('username')}
          />
          {formErrors.username && <p className={styles.error}>{formErrors.username}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormField('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
          />
          {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <textarea
            placeholder="Задача"
            value={formData.text}
            onChange={(e) => setFormField('text', e.target.value)}
            onBlur={() => handleFieldBlur('text')}
          />
          {formErrors.text && <p className={styles.error}>{formErrors.text}</p>}
        </div>

        <button type="submit" disabled={loading}>
          Добавить
        </button>
      </form>

      {success && <p className={styles.success}>Задача успешно добавлена!</p>}
      {error && <p className={styles.formError}>{error}</p>}
    </>
  );
};
