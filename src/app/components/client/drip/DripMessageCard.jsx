"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Award } from "lucide-react";

const WELCOME_MESSAGE = `👋 Welcome to Client Health Tracker!

Start strong:
 1. Tap Profile to update your password
 2. Track meals, weight & more daily
 3. Message your coach anytime
 4. The more you log, the better your results

You've got this — let's make today count!`;

const DripMessageCard = () => {
  const [message, setMessage] = useState("Loading...");
  const [showWelcome, setShowWelcome] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const fetchDailyMessage = async () => {
      const dailyMessage = await fetch("/api/client/daily_message_seen");
      const dailyMessageData = await dailyMessage.json();
      if (!dailyMessageData.dailyMessage[0].dailyMessage) {
        setMessage(WELCOME_MESSAGE);
        setShowWelcome(true);
      }
      else{
        setShowWelcome(false);
        fetch("/api/client/daily-drip-message")
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(() => setMessage("Welcome!"));      }
    }
    fetchDailyMessage();
  }, []);
  const handleCheckbox = async (e) => {
    setDontShowAgain(e.target.checked);
    if (e.target.checked) {
      const response = await fetch("/api/client/daily_message_seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setShowWelcome(false);
      // Optionally, show the daily drip message after hiding welcome
      fetch("/api/client/daily-drip-message")
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(() => setMessage("Welcome!"));
    }
  };

  if (showWelcome) {
    return (
      <Card className="mb-6 border-l-4 border-l-primary w-full max-w-full">
        <CardContent className="px-2 sm:px-4">
          <h3 className="font-medium text-base sm:text-lg mb-2">👋 Daily Motivation</h3>
          <pre className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap mb-2">{WELCOME_MESSAGE}</pre>
          <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={handleCheckbox}
              className="accent-primary"
            />
            If you want to see new daily messages from the next day, check this box
          </label>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
    <CardContent className="p-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <div className="text-3xl">✨</div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Daily Motivation</h3>
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
          {/* <Badge className="mt-3 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100">
            <Award className="w-3 h-3 mr-1" />
            Consistency Streak: 12 days
          </Badge> */}
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default DripMessageCard;
