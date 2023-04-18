@Repository
public class MessageDao {

    public ResultSet getMessageByChannelID(int channelID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select * from channel where id=?");
        st.setInt(1, channelID);
        set = st.executeQuery();
        return set;
    }

    public ResultSet getMessageByMessageID(int messageID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select from message where id=?");
        st.setInt(1, channelID);
        set = st.executeQuery();
        return set;
    }

    public ResultSet getMessageAfterMessageID(int messageID) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("select * from message where id >= ?");
        st.setInt(1, messageID);
        set = st.executeQuery();
        return set;
    }

    public ResultSet getMessageAfterTime(Date date) throws SQLException {
        ResultSet result;
        PreparedStatement st;
        st = connection.prepareStatement("");
        //st.setInt(1, messageID);
        set = st.executeQuery();
        return set;
    }
}