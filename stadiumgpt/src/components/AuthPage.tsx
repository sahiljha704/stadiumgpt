export function AuthPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="w-full h-[100dvh] bg-[#EDDCD9] text-[#264143] flex items-center justify-center">
      <div className="wrapper">
        <label>
          <input className="toggle" type="checkbox" />
          <div className="switch">
            <span className="slider"></span>
            <span className="card-side"></span>
          </div>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" action="" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                <button className="flip-card__btn" type="submit">Let`s go!</button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" action="" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <input className="flip-card__input" placeholder="Name" type="text" />
                <input className="flip-card__input" name="email" placeholder="Email" type="email" />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" />
                <button className="flip-card__btn" type="submit">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
