import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Scale, BarChart2, CheckCircle, BookOpen } from "lucide-react";

const QuickActions = () => {
  return (
    
          <Card className="premium-card bg-gradient-to-r from-gray-50/80 to-white/80">
          <CardHeader>
            <CardTitle className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Quick Actions
            </CardTitle>
            <p className="text-gray-600">Fast-track your health journey</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button className="h-20 flex-col gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all group">
                <Link href="/client/check-in">
                <CheckCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Daily Check-In</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-sm hover:shadow-lg transition-all group">
                <Link href="/client/program">
                <BookOpen className="h-7 w-7 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                <span className="font-semibold text-gray-700 group-hover:text-blue-700">My Program</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    
    
  );
};

export default QuickActions;
