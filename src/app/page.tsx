import Calendar from "@/app/components/Calendar";
import { MaxWidthWrapper } from "@/app/components/MaxWidthWrapper";

export default function Home() {
    return (
        <section>
            <MaxWidthWrapper className="text-center">
                <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-4 sm:p-2 font-[family-name:var(--font-geist-sans)]">
                    <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
                        <Calendar />
                    </main>
                </div>
            </MaxWidthWrapper>
        </section>
    );
}
