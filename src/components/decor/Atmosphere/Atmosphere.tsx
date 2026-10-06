import styles from "./Atmosphere.module.scss";

export const Atmosphere = () => (
    <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.atmosphere__glow} />
        <div className={styles.atmosphere__grain} />
    </div>
);
