//@ts-nocheck
import type React from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package } from 'lucide-react';
import { SignupForm } from './components/SignupForm';
import { OTPVerification } from './components/OTPVerification';
import { signupStepAtom } from './state/signupAtoms';

export const Signup: React.FC = () => {
  const [step] = useAtom(signupStepAtom);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md my-4 md:my-6 rounded-xl">
        {/* Logo */}

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center">
              {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Package className="h-7 w-7" />
            </div> */}
              {/* <span className="text-2xl font-bold text-gradient">CREED</span> */}
              <img
                className="h-28 w-28 brightness-110 contrast-125"
                src="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20version='1.1'%20viewBox='0%200%202000%202000'%20width='1280'%20height='1280'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill='%23002d46'%20transform='translate(1304,502)'%20d='m0%200h13l35%203%2018%204%2016%205%2021%207%2016%208%2022%2012%2015%2011%2011%208%2014%2012%209%208%205%206%208%207%209%2011%2012%2015%2012%2017%205%207%206%2011%2010%2017%208%2016%208%2015%2010%2026%207%2019%206%2022%207%2023%204%2021%208%2054%202%2022v70l-3%2031-7%2045-4%2020-10%2033-5%2018-8%2020-5%2014-16%2032-11%2021-8%2013-10%2014-9%2012-11%2013-9%2011-19%2019-22%2018-8%206-21%2014-16%208-17%208-29%2010-19%206-20%203-39%204-30%201-319%201-5-1-1-10-1-28v-414l-1-213v-35l1-1h335l1%201v54h-277v194h94l2%201v52l-1%201-95%201v22l-1%209h96l1%201v55l-53%201h-42v48l-1%20206%20269-1%2037-1%2028-4%2020-6%2017-6%2011-3%2019-10%208-4%207-4%209-7%2010-7%207-6h2l2-4%2015-13%207-8%2010-11%2013-18%206-8%205-10%207-9%2013-27%208-16%2015-40%206-25%208-34%203-21%203-43v-60l-3-41-3-21-15-61-11-28-6-17-9-16-9-19-7-10-9-15-16-21-5-6-6-5-7-9-20-18-19-13-10-6-18-10-11-5-19-6%201%205v615l-1%2066-5%204-15%205-15%203-19%202-18%201h-167l-1-3v-524l1-2h55l1%201v163h98l1%201v54l-1%201h-32l-65-1-1%2030h35l62%201%201%201v56h-96v177h123v-43l1-309v-365z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(810,563)'%20d='m0%200h7l12%203%2013%207%2010%209%2011%207%2018%2018%2013%2020%206%2012%2010%2032%201%204v189l-3%2017-6%2020-5%2013-10%2017-8%2011-5%206-16%2016-12%208-14%2010-8%203%204%205%208%207%2012%2010%206%208%206%205%2013%2017%2010%2015%2016%2032%204%2015%206%2024%202%2014v245l325-1%2062-1%2036-3%2020-4%2051-15%2017-8%2016-7%2020-12%2019-13%2016-12%2011-10%208-7%207-8%2016-16%201-2h2l2-4%2014-18%2014-23%208-12h3l-3%207-15%2029-6%2012-6%209-8%2014-11%2016-10%2013-12%2014-7%208-28%2028-30%2023-8%204-11%208-16%208-11%206-12%206-18%206-24%209-16%204-26%204-22%203-27%202h-396l-1-1-1-9-2-293-4-25-5-12-10-19-7-11-7-9-6-8-13-13-4-5-11-8-8-7-20-12-15-7v-37l2-4%2015-7%2020-6%2032-17%2010-9%209-7%206-9%207-10%205-11%203-14%201-9v-175l-3-20-4-11-13-17-17-10-8-2h-13l-23%205-19%206-13%204-10%206-1%20178-1%20463v60l1%203v31l25-5%2014-6%204-1%2019%2014%2011%209%204%203%2010%205%204%204-1%205-16%207-8%205-13%206-19%205-33%207h-58l-1-88v-672l1-86%201-3%206-2%207-1h47l15%203%2010%203h7l22-22%2016-6z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(681,502)'%20d='m0%200h20l19%201%2017%203%2018%207%2025%2010%206%204v4l-5%204-11%205-15%2012-8%207-9%209-2%201-13-1-11-2-12-1h-17l-14%201-24%205-17%207-13%208-11%204-5%205-17%2012-15%2014-11%2010-7%208-7%207-11%2016-7%209-3%204-4%208-9%2014-11%2023-7%2014-6%2015-8%2018-13%2042-7%2025-7%2040-5%2032-3%2034v73l4%2040%208%2047%204%2022%208%2027%209%2030%2013%2031%206%2016%2010%2019%209%2016%2014%2022%2014%2018%2011%2013%2012%2013%2020%2018%2013%209%2011%208%2011%206%204%205v65l-6-1-24-11-15-10-12-7-15-12-8-6-8-9-8-6-11-12-7-6-8-11-7-8-8-12-9-12-6-9-7-12-9-16-16-32-9-21-7-17-5-18-11-33-5-25-7-29-4-22-6-65-1-19v-45l2-26%205-54%204-25%209-36%204-20%2012-36%204-14%207-17%207-15%205-13%2010-18%206-12%2011-18%205-9%207-8%2014-21%2010-11%207-9%205-4%207-9%2011-10%208-7%2011-9%2018-13%2012-6%2010-7%2012-6%2012-4%2015-6%2014-4%2013-2z'/%3e%3cpath%20fill='%23002d46'%20transform='translate(881,566)'%20d='m0%200%20394%201v54l-1%201h-352l-5-8-7-11-14-19-11-12-5-5z'/%3e%3c/svg%3e"
                alt=""
              />
            </Link>
          </div>

          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {step === 'form' ? 'Create your account' : 'Verify your email'}
            </CardTitle>
            <CardDescription>
              {step === 'form'
                ? 'Join thousands of happy customers'
                : 'Enter the verification code we sent to your email'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'form' ? <SignupForm /> : <OTPVerification />}

            {step === 'form' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary  hover:text-primary-hover font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
