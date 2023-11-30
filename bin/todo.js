import fs from "fs";
import os from "os";
import path from "path";
import { Table } from "console-table-printer";

/**
 * @typedef TodoItem
 * @type {object}
 * @property {number} index
 * @property {string} task
 * @property {string} done
 * @property {string} createdAt
 * @property {string} completedAt
 */

class Todo {
    /**
     * Adds an item to the todo list
     * @param {string} text
     */
    add = (text) => {
        this.#loadFile((items) => {
            const newItem = {
                index: items.length + 1,
                task: text,
                done: "no",
                createdAt: this.#getFormattedDate(),
                completedAt: "",
            };

            items.push(newItem);

            this.#saveFile(items);

            this.showList(items);
        });
    };

    /**
     * Completes a task at the specified index
     * @param {number} index
     */
    completeTask = (index) => {
        this.#loadFile((items) => {
            // This could be better done with a binary search
            for (let i = 0; i < items.length; i++) {
                if (
                    Number(items[i].index) === index &&
                    !items[i].task.includes("✅")
                ) {
                    items[i].task = "✅ " + items[i].task;
                    items[i].done = "yes";
                    items[i].completedAt = this.#getFormattedDate();
                    break;
                }
            }

            this.#saveFile(items);
            this.showList(items);
        });
    };

    /**
     * Deletes a task at the specified index
     * @param {number} index
     */
    deleteTask = (index) => {
        this.#loadFile((items) => {
            const itemsWithoutDeleted = items.filter(
                (item) => Number(item.index) !== index
            );

            // Keeps list index consistency
            const updatedItems = itemsWithoutDeleted.map((item, i) => {
                return {
                    ...item,
                    index: i + 1,
                };
            });

            this.#saveFile(updatedItems);
            this.showList(updatedItems);
        });
    };

    /**
     * Prints todo list, if no items are passed, it loads the file
     * @param {TodoItem[]|undefined} items
     */
    showList = (items) => {
        if (items) {
            this.#buildAndPrintTable(items);
        } else {
            this.#loadFile((items) => this.#buildAndPrintTable(items));
        }
    };

    /**
     * @callback loadedFile
     * @param {TodoItem[]} items - Todo items list
     */
    /**
     * @param {loadedFile} callback - Callback returning TodoItem list
     */
    #loadFile = (callback) => {
        fs.readFile(this.#getFileName(), (err, data) => {
            if (err) {
                console.log("File not found..");
            }
            const itemStrList = data.toString().split(os.EOL);

            const items = itemStrList.map((itemStr) =>
                this.#stringToItem(itemStr)
            );

            callback(items);
        });
    };

    /**
     * Saves TodoItem list to file
     * @param {TodoItem[]} items
     */
    #saveFile = (items) => {
        let fileInput = "";
        items.forEach((item, index) => {
            if (index === items.length - 1) {
                // if is the last item dont add EOL
                fileInput += this.#itemToString(item);
            } else {
                fileInput += this.#itemToString(item) + os.EOL;
            }
        });

        fs.writeFile(this.#getFileName(), fileInput, (err) => {
            if (err) throw err;
        });
    };

    /**
     *
     * @param {TodoItem[]} items
     */
    #buildAndPrintTable = (items) => {
        const pendingTasks = items.filter((i) => i.done === "no").length;

        const table = new Table({
            title: `You have ${pendingTasks} pending tasks to finish`,
            charLength: { "✅": 2 },
            columns: [
                {
                    title: "#",
                    name: "index",
                    alignment: "left",
                    color: "white",
                },
                { title: "Task", name: "task", alignment: "left" },
                { title: "Done?", name: "done", alignment: "left" },
                {
                    title: "Created At",
                    name: "createdAt",
                    alignment: "left",
                    color: "white",
                },
                {
                    title: "Completed At",
                    name: "completedAt",
                    alignment: "left",
                    color: "white",
                },
            ],
        });

        items.forEach((item) => {
            table.addRow(item, {
                color: item.done === "yes" ? "green" : "magenta",
            });
        });

        table.printTable();
    };

    #getFileName = () => {
        let __dirname = path.join(os.homedir(), "Desktop");
        let fileName = __dirname + "/todo.txt";
        return fileName;
    };

    /**
     * Formates an item object to string
     * index, task, done, createdAt, completedAt
     * @param {TodoItem} item
     * @returns {string}
     */
    #itemToString = (item) => {
        return (
            `${item.index}|${item.task}|${item.done}|` +
            `${item.createdAt}|${item.completedAt}`
        );
    };

    /**
     * Converts a String to an item
     * @param {string} str
     * @returns {TodoItem}
     */
    #stringToItem = (itemStr) => {
        const arr = itemStr.split("|");
        return {
            index: arr[0],
            task: arr[1],
            done: arr[2],
            createdAt: arr[3],
            completedAt: arr[4],
        };
    };

    #getFormattedDate = () => {
        const currentDate = new Date();
        return (
            `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-` +
            `${currentDate.getDate()} ${currentDate.getHours()}:` +
            `${currentDate.getMinutes()}:${currentDate.getSeconds()}`
        );
    };
}

export default new Todo();
