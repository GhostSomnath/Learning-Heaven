// this is a additional feature which can be implemented for generating dynamic qr code.


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>
<script>
    document.getElementById('checkoutButton').addEventListener('click', function() {
        var totalAmount = '<%=totalAmount%>'; // Pass this dynamically if necessary
        var qrCodeData = `https://example-payment-url.com?amount=${totalAmount}`; // Your payment URL

        $('#qrCode').empty().qrcode({
            text: qrCodeData
        });
        
        document.getElementById('paymentModal').classList.remove('hidden');
    });

    document.getElementById('finishButton').addEventListener('click', function() {
        document.getElementById('paymentModal').classList.add('hidden');
        // Redirect to another page or perform additional actions
    });
</script>
