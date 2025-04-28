
import { SpecialPieceType } from '@/types/game';
import { cn } from '@/lib/utils';

interface SportsBallProps {
  special?: SpecialPieceType;
}

export const Basketball: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] relative overflow-hidden",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-orange via-white to-game-orange" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-orange via-white to-game-orange" : ""
    )}>
      {!special ? (
        <img 
          src="/lovable-uploads/d0c499fd-7c7c-4db9-8598-751fc3066e43.png" 
          alt="Basketball" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className={cn(
          "w-full h-full bg-center bg-contain bg-no-repeat",
          "bg-[url('/lovable-uploads/d0c499fd-7c7c-4db9-8598-751fc3066e43.png')]"
        )}/>
      )}
    </div>
  );
};

export const PingPong: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] relative overflow-hidden",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-orange via-white to-game-orange" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-orange via-white to-game-orange" : ""
    )}>
      {!special ? (
        <img 
          src="/lovable-uploads/b7b89e31-2571-4b55-b55a-b00baf29980a.png" 
          alt="Ping Pong" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className={cn(
          "w-full h-full bg-center bg-contain bg-no-repeat",
          "bg-[url('/lovable-uploads/b7b89e31-2571-4b55-b55a-b00baf29980a.png')]"
        )}/>
      )}
    </div>
  );
};

export const EightBall: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] relative overflow-hidden",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-white via-black to-white" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-white via-black to-white" : ""
    )}>
      {!special ? (
        <img 
          src="/lovable-uploads/1d8020cf-25f0-4325-9c79-b5fd521e1874.png" 
          alt="Eight Ball" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className={cn(
          "w-full h-full bg-center bg-contain bg-no-repeat",
          "bg-[url('/lovable-uploads/1d8020cf-25f0-4325-9c79-b5fd521e1874.png')]"
        )}/>
      )}
    </div>
  );
};

export const Swimmer: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] relative overflow-hidden",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-orange via-white to-game-orange" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-orange via-white to-game-orange" : ""
    )}>
      {!special ? (
        <img 
          src="/lovable-uploads/9554cea5-78d3-42c0-9253-5bcfa5cc1007.png" 
          alt="Swimmer" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className={cn(
          "w-full h-full bg-center bg-contain bg-no-repeat",
          "bg-[url('/lovable-uploads/9554cea5-78d3-42c0-9253-5bcfa5cc1007.png')]"
        )}/>
      )}
    </div>
  );
};
