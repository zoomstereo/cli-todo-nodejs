#!/usr/bin/env node
import yargs from "yargs/yargs";
import todo from "./todo.js";

yargs(process.argv.slice(2))
    .scriptName("todo")
    .usage("$0 <cmd> [args]")
    .command("show", "Shows the todo list", () => todo.showList())
    .command(
        "add [newTodo]",
        "Add new todo item to the list",
        (yargs) =>
            yargs.positional("newTodo", {
                type: "string",
            }),
        (argv) => todo.add(argv.newTodo)
    )
    .command(
        "complete [index]",
        "Marks as completed an item in the list",
        (yargs) =>
            yargs.positional("index", {
                type: "number",
            }),
        (argv) => todo.completeTask(argv.index)
    )
    .command(
        "del [index]",
        "Deletes an item in the list",
        (yargs) =>
            yargs.positional("index", {
                type: "number",
            }),
        (argv) => todo.deleteTask(argv.index)
    )
    .command("clear", "Clears up the todo list", () =>
        console.log("MISSING COMMAND, TO IMPLEMENT")
    )
    .help(true).argv;
