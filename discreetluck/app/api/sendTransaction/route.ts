import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST() {
  try {
    // Path to your Hardhat project folder
    const hardhatPath = path.resolve(process.cwd(), "../hardhat");
    const scriptPath = path.join(hardhatPath, "scripts/sendTransaction.js");

    return new Promise((resolve, reject) => {
      exec(
        `npx hardhat run ${scriptPath} --network localhost`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing script: ${error}`);
            reject(new NextResponse("Error executing script", { status: 500 }));
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(new NextResponse(stdout, { status: 200 }));
        }
      );
    });
  } catch (error) {
    console.error("Error running transaction script:", error);
    return new NextResponse("Error running transaction script", {
      status: 500,
    });
  }
}
