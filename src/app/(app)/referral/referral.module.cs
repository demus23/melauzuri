.page{
  display: grid;
  gap: 28px;
}

.hero{
  display: grid;
  gap: 10px;
  padding: 12px 0 6px;
}

.badge{
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.76);
  border: 1px solid var(--borderSoft);
  color: var(--textStrong);
  font-size: 12px;
  font-weight: 900;
  box-shadow: var(--shadow2);
}

.h1{
  margin: 0;
  font-size: 36px;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--textStrong);
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
}

.p{
  margin: 0;
  max-width: 60ch;
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted);
  font-weight: 600;
}

/* =========================
   REFERRAL LINK CARD
   ========================= */

.linkCard{
  background: var(--card);
  border: 1px solid var(--borderSoft);
  border-radius: 24px;
  padding: 22px 20px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 14px;
}

.linkCardLabel{
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.copyRow{
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.urlDisplay{
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border-radius: 16px;
  background: rgba(200,115,58,0.06);
  border: 1px solid var(--borderSoft);
  min-width: 0;
}

.urlCode{
  font-size: 16px;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.urlFull{
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copyBtn{
  padding: 13px 20px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary2));
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 30px var(--primaryGlow);
  transition: transform 120ms ease, background 120ms ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.copyBtn:hover{
  transform: translateY(-1px);
}

.copyBtnCopied{
  background: linear-gradient(135deg, var(--accent), var(--accent2));
}

.linkNote{
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  font-weight: 600;
}

/* =========================
   STATS
   ========================= */

.statsGrid{
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.statCard{
  background: var(--card);
  border: 1px solid var(--borderSoft);
  border-radius: 20px;
  padding: 18px 16px;
  box-shadow: var(--shadow2);
  display: grid;
  gap: 6px;
}

.statNum{
  font-size: 28px;
  font-weight: 900;
  color: var(--textStrong);
  letter-spacing: -0.04em;
  line-height: 1;
}

.statLabel{
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  line-height: 1.4;
}

/* =========================
   HOW IT WORKS
   ========================= */

.section{
  display: grid;
  gap: 16px;
}

.h2{
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--textStrong);
  font-weight: 950;
}

.stepsGrid{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stepCard{
  background: var(--card);
  border: 1px solid var(--borderSoft);
  border-radius: 20px;
  padding: 20px 18px;
  display: grid;
  gap: 8px;
}

.stepNum{
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 950;
  font-size: 14px;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--primary2));
  box-shadow: 0 8px 20px var(--primaryGlow);
}

.stepTitle{
  font-size: 15px;
  font-weight: 900;
  color: var(--textStrong);
}

.stepDesc{
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  font-weight: 600;
}

/* =========================
   REWARD NOTICE
   ========================= */

.rewardNotice{
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 20px;
  background: var(--okBg);
  border: 1px solid var(--okBd);
}

.rewardIcon{
  font-size: 24px;
  flex-shrink: 0;
}

.rewardTitle{
  font-size: 15px;
  font-weight: 900;
  color: var(--okTx);
  margin-bottom: 4px;
}

.rewardDesc{
  margin: 0;
  font-size: 13px;
  color: var(--okTx);
  line-height: 1.6;
  font-weight: 600;
  opacity: 0.85;
}

.rewardLink{
  color: var(--okTx);
  font-weight: 800;
  text-decoration: underline;
}

/* =========================
   TERMS
   ========================= */

.terms{
  margin: 0;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
  text-align: center;
  max-width: 70ch;
  justify-self: center;
}

/* RESPONSIVE */

@media (max-width: 900px){
  .statsGrid{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stepsGrid{
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px){
  .statsGrid{
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .h1{
    font-size: 28px;
  }

  .copyRow{
    flex-direction: column;
    align-items: stretch;
  }

  .copyBtn{
    text-align: center;
  }
}