'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navigation.module.css';
import { MdOutlineOutput, MdMenu, MdClose } from "react-icons/md";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.nav}>
        <h2 className={styles.title}>
          <Link href="/" className={styles.titleLink}>
            score.dp
          </Link>
        </h2>
        
        {/* 데스크톱 메뉴 */}
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <Link href="https://zasa.sakura.ne.jp/dp/rank.php" className={styles.link}>
              <span className={styles.linkWithIcon}>Rank <MdOutlineOutput /></span>
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/user" className={styles.link}>
              Player
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/data" className={styles.link}>
              Player Data
            </Link>
          </li>
        </ul>

        {/* 모바일 햄버거 버튼 */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <MdMenu size={24} />
        </button>
      </nav>

      {/* 모바일 백그라운드 오버레이 */}
      {isMenuOpen && <div className={styles.mobileOverlay} onClick={closeMenu} />}

      {/* 모바일 드롭다운 메뉴 */}
      <div className={`${styles.mobileDropdown} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileMenuList}>
          <li className={styles.mobileMenuItem}>
            <Link href="https://zasa.sakura.ne.jp/dp/rank.php" className={styles.mobileMenuLink} onClick={closeMenu}>
              <span className={styles.linkWithIcon}>Rank <MdOutlineOutput /></span>
            </Link>
          </li>
          <li className={styles.mobileMenuItem}>
            <Link href="/user" className={styles.mobileMenuLink} onClick={closeMenu}>
              Player
            </Link>
          </li>
          <li className={styles.mobileMenuItem}>
            <Link href="/data" className={styles.mobileMenuLink} onClick={closeMenu}>
              Player Data
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}