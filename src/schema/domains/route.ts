// // src/app/api/domains/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";
// import { prisma } from "@/lib/db";
// //import { DomainSchema } from "@/schema/domains.schema";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = getAuth();
    
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
    
//     const body = await req.json();
//     const validatedData = DomainSchema.safeParse(body);
    
//     if (!validatedData.success) {
//       return NextResponse.json(
//         { error: "Invalid domain data", details: validatedData.error },
//         { status: 400 }
//       );
//     }
    
//     const user = await prisma.user.findFirst({
//       where: { clerkId: userId },
//     });
    
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
    
//     // Create the domain
//     const domain = await prisma.domain.create({
//       data: {
//         name: validatedData.data.name,
//         icon: validatedData.data.icon || "",
//         userId: user.id,
//       },
//     });
    
//     return NextResponse.json({ domain }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating domain:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }