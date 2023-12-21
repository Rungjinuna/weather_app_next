//화면 중앙에 네모 박스 (WelcomeContent와 AuthForm이 표시되는곳 -> 부모컴포넌트)

import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  className?: string;
};
const Card = ({ children, className }: Props) => {
  return <section className={`main__box ${className}`}>{children}</section>;
};

export default Card;
