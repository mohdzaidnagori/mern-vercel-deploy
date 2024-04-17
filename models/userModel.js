

import { DataTypes } from 'sequelize';
// Path to the database configuration file
import { sequelize } from "../config/db.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    logo: {
        type: DataTypes.STRING
    },
    company_name: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    communication: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
    is_active: {
        type: DataTypes.STRING
    },
    team_name: {
        type: DataTypes.STRING
    },
    channel_ptn_id: {
        type: DataTypes.INTEGER
    },
    contact_number: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'tbl_user_details',
    timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
});


const HomeSchema = sequelize.define('HomeSchema', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    redirect_link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banner_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
},
    {
        tableName: 'tbl_homebanner',
        timestamps: false, // Set to true if you want Sequelize to automatically manage createdAt and updatedAt columns
    }
)

export default User;